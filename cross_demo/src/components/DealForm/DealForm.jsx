import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import useDealsStore from '../../stores/useDealsStore';
import useActivitiesStore from '../../stores/useActivitiesStore';
import { notify } from '../../utils/notifications';
import logger from '../../utils/logger';
import './DealForm.css';

const DealForm = ({ deal = null, repId, repName, region, onClose, onSave }) => {
  const { addDeal, updateDeal } = useDealsStore();
  const { logDealActivity } = useActivitiesStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: deal || {
      name: '',
      company: '',
      industry: '',
      stage: 'Prospecting',
      value: '',
      probability: 20,
      closeDate: '',
      description: ''
    }
  });

  const stages = [
    'Prospecting',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  const industries = [
    'Automotive OEM',
    'Automotive Tier-1',
    'Commercial Vehicles',
    'EV Manufacturing',
    'Automotive Parts',
    'Fleet Management',
    'Logistics & Transport'
  ];

  const onSubmit = (data) => {
    try {
      if (deal) {
        // Update existing deal
        updateDeal(deal.id, data);
        
        logDealActivity(
          deal.id,
          repId,
          'deal_updated',
          `${repName} updated deal details`,
          { changes: data }
        );
        
        notify.dealUpdated(data.name);
      } else {
        // Create new deal
        const newDeal = addDeal({
          ...data,
          repId,
          repName,
          region,
          status: 'active'
        });
        
        logDealActivity(
          newDeal.id,
          repId,
          'deal_created',
          `${repName} created new deal`,
          { deal: newDeal }
        );
        
        notify.dealCreated(data.name);
      }
      
      if (onSave) onSave();
      onClose();
    } catch (error) {
      logger.error('Error saving deal:', error);
      notify.saveError();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content deal-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{deal ? 'Edit Deal' : 'New Deal'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="deal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Deal Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Deal name is required' })}
                placeholder="Enter deal name"
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                {...register('company', { required: 'Company name is required' })}
                placeholder="Company name"
              />
              {errors.company && <span className="error-message">{errors.company.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Industry *</label>
              <select
                {...register('industry', { required: 'Industry is required' })}
              >
                <option value="">Select Industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              {errors.industry && <span className="error-message">{errors.industry.message}</span>}
            </div>

            <div className="form-group">
              <label>Stage *</label>
              <select
                {...register('stage', { required: 'Stage is required' })}
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              {errors.stage && <span className="error-message">{errors.stage.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Deal Value (₹) *</label>
              <input
                type="number"
                {...register('value', { 
                  required: 'Deal value is required',
                  min: { value: 0, message: 'Value must be positive' }
                })}
                placeholder="Enter value"
              />
              {errors.value && <span className="error-message">{errors.value.message}</span>}
            </div>

            <div className="form-group">
              <label>Probability (%)</label>
              <input
                type="number"
                {...register('probability', {
                  min: { value: 0, message: 'Must be between 0-100' },
                  max: { value: 100, message: 'Must be between 0-100' }
                })}
                placeholder="0-100"
              />
              {errors.probability && <span className="error-message">{errors.probability.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Expected Close Date</label>
            <input
              type="date"
              {...register('closeDate')}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register('description')}
              placeholder="Additional details about this deal..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {deal ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;
